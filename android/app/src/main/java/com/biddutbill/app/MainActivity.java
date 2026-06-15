package com.biddutbill.app;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ProgressBar progressBar;
    private TextView loadingText;
    private View loadingView;
    private boolean isSplashDone = false;
    private boolean isPageLoaded = false;
    private boolean doubleBackToExitPressedOnce = false;

    // 🔥 Web URL - তোমার index.html লোকেশন
    // Production: তোমার হোস্ট করা URL দাও
    // Development: "file:///android_asset/index.html"
    private static final String APP_URL = "file:///android_asset/index.html";
    // যদি তোমার সার্ভারে হোস্ট করো:
    // private static final String APP_URL = "https://biddutbill-360dd.web.app";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize views
        webView = findViewById(R.id.webView);
        swipeRefreshLayout = findViewById(R.id.swipeRefresh);
        progressBar = findViewById(R.id.progressBar);
        loadingText = findViewById(R.id.loadingText);
        loadingView = findViewById(R.id.loadingView);

        // Check internet
        if (!isNetworkAvailable()) {
            showNoInternetDialog();
        }

        // Setup SwipeRefresh
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                webView.reload();
            }
        });

        // Setup WebView
        setupWebView();

        // Show splash for 2 seconds
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                isSplashDone = true;
                if (isPageLoaded) {
                    hideLoading();
                }
            }
        }, 2000);

        // Load the app
        webView.loadUrl(APP_URL);
    }

    private void setupWebView() {
        // Enable JavaScript
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setDatabaseEnabled(true);
        webView.getSettings().setCacheMode(android.webkit.WebSettings.LOAD_DEFAULT);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(true);
        
        // Offline support for Firebase
        webView.getSettings().setDatabasePath(getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath());

        // WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                loadingText.setText("লোড হচ্ছে...");
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
                
                isPageLoaded = true;
                if (isSplashDone) {
                    hideLoading();
                }

                // Inject Firebase config into WebView
                injectFirebaseConfig();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
                
                loadingText.setText("সংযোগ ব্যর্থ! পুনরায় চেষ্টা করুন...");
                Toast.makeText(MainActivity.this, 
                    "লোড করতে সমস্যা হচ্ছে। ইন্টারনেট চেক করুন!", 
                    Toast.LENGTH_SHORT).show();
            }
        });

        // WebChromeClient for progress
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                if (newProgress < 100) {
                    progressBar.setProgress(newProgress);
                }
            }
        });
    }

    private void injectFirebaseConfig() {
        // Firebase SDK is already loaded via HTML script tags
        // Just trigger the app to initialize
        webView.evaluateJavascript(
            "if (typeof tryFirebaseInit === 'function') { tryFirebaseInit(); }", 
            null
        );
    }

    private void hideLoading() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                loadingView.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
            }
        });
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
    }

    private void showNoInternetDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("ইন্টারনেট নেই")
               .setMessage("এই অ্যাপ ব্যবহার করতে ইন্টারনেট সংযোগ প্রয়োজন। দয়া করে ইন্টারনেট চালু করুন।")
               .setPositiveButton("আবার চেষ্টা", new DialogInterface.OnClickListener() {
                   @Override
                   public void onClick(DialogInterface dialog, int which) {
                       if (isNetworkAvailable()) {
                           dialog.dismiss();
                       } else {
                           showNoInternetDialog();
                       }
                   }
               })
               .setNegativeButton("Exit", new DialogInterface.OnClickListener() {
                   @Override
                   public void onClick(DialogInterface dialog, int which) {
                       finishAffinity();
                   }
               })
               .setCancelable(false)
               .show();
    }

    // Back button - double press to exit
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (webView.canGoBack()) {
                webView.goBack();
                return true;
            } else {
                if (doubleBackToExitPressedOnce) {
                    finishAffinity();
                    return true;
                }
                this.doubleBackToExitPressedOnce = true;
                Toast.makeText(this, "আবার চাপুন প্রস্থান করতে", Toast.LENGTH_SHORT).show();
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        doubleBackToExitPressedOnce = false;
                    }
                }, 2000);
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        webView.restoreState(savedInstanceState);
    }
}
