/**
 * ログイン処理スクリプト
 */
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-submit-btn');
    const accountIdInput = document.getElementById('account-id');
    const passwordInput = document.getElementById('password');

    // Cookieにトークンを保存するヘルパー関数
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const loginId = accountIdInput.value.trim();
            const password = passwordInput.value;

            // デフォルトの遷移先
            let redirectUrl = '../books/mypage.html';

            // バリデーションチェック
            if (!loginId || !password) {
                alert("アカウントIDとパスワードを入力してください。");
                return;
            }

            const loginData = {
                "loginId": loginId,
                "password": password
            };

            const apiUrl = 'http://localhost:8080/api/auth/login';

            // ボタンをローディング表示にし、二重送信を防ぐ
            loginButton.textContent = 'ログイン中...';
            loginButton.style.pointerEvents = 'none';

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });

                if (response.ok) {
                    const data = await response.json();
                    const token = data.token;

                    if (token) {
                        // トークンをCookieに保存 (例: 7日間有効)
                        setCookie('authToken', token, 7);
                        console.log('ログイン成功。トークンをCookieに保存しました。');

                        // URLパラメータをチェック
                        const params = new URLSearchParams(window.location.search);
                        const projectId = params.get('projectId');

                        // projectIdが存在する場合は遷移先を変更
                        if (projectId != null) {
                            redirectUrl = '../books/isbn-search.html';
                            localStorage.setItem('projectId', projectId);
                        }

                        console.log(redirectUrl);

                        // ログイン成功後の画面へ遷移
                        window.location.href = redirectUrl;
                    } else {
                        throw new Error("API応答にトークンが含まれていません。");
                    }
                } else {
                    // 失敗レスポンス
                    const errorText = await response.text();
                    let errorMessage = `ログインに失敗しました。ステータスコード: ${response.status}`;

                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        // JSONとしてパースできない場合は無視
                    }

                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('ログイン処理エラー:', error.message);
                alert(`ログインエラー: ${error.message}\nIDまたはパスワードが正しくありません。`);
            } finally {
                // 処理が完了したらボタンを元に戻す
                loginButton.textContent = 'ログイン';
                loginButton.style.pointerEvents = 'auto';
            }
        });
    }

    // --- 既存のテーマロード関数 ---
    async function loadTheme() {
        try {
            const response = await fetch('/api/theme');
            const theme = await response.json();

            if (typeof setThemeVariable === 'function') {
                setThemeVariable('--main-color', theme.mainColor);
                setThemeVariable('--back-color', theme.backColor);
                setThemeVariable('--font-normal', theme.fontNormal);
                setThemeVariable('--text-white-color', theme.textWhiteColor);
            } else {
                console.warn("setThemeVariable関数が見つかりません。../js/theme.jsが正しく読み込まれているか確認してください。");
            }
        } catch (err) {
            console.error("テーマ読み込み失敗:", err);
        }
    }

    // ページ読み込み時に適用
    loadTheme();

    // --- projectIdの有無による表示制御 ---
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('projectId');
    
    // projectIdがない場合、新規登録関連の要素を非表示にする
    if (projectId === null) {
        const divider = document.querySelector('.divider');
        const signupBtn = document.getElementById('signup-btn');
        
        if (divider) {
            divider.style.display = 'none';
        }
        if (signupBtn) {
            signupBtn.style.display = 'none';
        }
    }

    // --- 新規登録ボタンの処理 ---
    const signupBtn = document.getElementById('signup-btn');
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            // projectIdが存在する場合はsessionStorageに保存
            if (projectId != null) {
                sessionStorage.setItem('projectId', projectId);
                console.log('projectIdをsessionStorageに保存しました:', projectId);
            }
            
            // リンクのデフォルト動作は継続(signup.htmlへ遷移)
        });
    }
});