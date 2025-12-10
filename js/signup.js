document.addEventListener('DOMContentLoaded', function () {

    // --- フォーム用スクリプト ---

    // 生年セレクトボックス
    const yearSelect = document.getElementById('birth-year');
    if (yearSelect) {
        const currentYear = new Date().getFullYear();
        const startYear = 1930;
        const endYear = currentYear;

        // HTMLに <option value="" selected hidden> がある前提
        for (let year = endYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        // 選択状態によって色を切り替える (CSS側で処理)
        yearSelect.addEventListener('change', function () {
            if (this.value === "" || this.value === "選択してください") {
                this.classList.remove('has-value');
            } else {
                this.classList.add('has-value');
            }
        });
    }

    // 郵便番号 → 住所
    const postalInput = document.getElementById('postal-code');
    const prefDisplay = document.getElementById('prefecture');
    const cityDisplay = document.getElementById('city');

    if (postalInput) {
        postalInput.addEventListener('input', function () {
            const postal = postalInput.value.replace(/[^0-9]/g, '');

            if (postal.length === 7) {
                fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postal}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.results) {
                            const result = data.results[0];
                            prefDisplay.textContent = result.address1;
                            cityDisplay.textContent = result.address2;
                        } else {
                            prefDisplay.textContent = "";
                            cityDisplay.textContent = "住所が見つかりません";
                        }
                    })
                    .catch(() => {
                        prefDisplay.textContent = "";
                        cityDisplay.textContent = "住所検索エラー";
                    });
            } else {
                prefDisplay.textContent = "";
                cityDisplay.textContent = "";
            }
        });
    }

    // 自己紹介文字数カウント
    const bio = document.getElementById('bio');
    const currentCount = document.getElementById('current-count');
    const maxLength = 300;

    if (bio && currentCount) {
        bio.addEventListener('input', function () {
            const length = bio.value.length;
            currentCount.textContent = length;
            if (length > maxLength) {
                currentCount.style.color = 'red';
            } else {
                currentCount.style.color = '#888';
            }
        });
    }

    // パスワード表示切替
    document.querySelectorAll('.toggle-password').forEach(function (icon) {
        icon.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });


    // --- モーダル用スクリプト ---

    const modal = document.getElementById('terms-modal');
    const modalBody = document.getElementById('modal-body-scroll'); // スクロール検知用
    const openBtn = document.getElementById('open-terms');
    const closeBtn = document.getElementById('close-terms');
    const agreeBtn = document.getElementById('agree-terms');
    const confirmBtn = document.getElementById('btn-to-confirm'); // 「確認へ」ボタン

    // 開く
    if (openBtn && modal && agreeBtn) {
        openBtn.addEventListener('click', function (e) {
            e.preventDefault();
            modal.style.display = 'flex';

            // モーダルを開いた時点で「同意する」ボタンを無効化
            agreeBtn.disabled = true;
        });
    }

    // 閉じる (×ボタン)
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    // モーダル本文のスクロールを検知
    if (modalBody && agreeBtn) {
        modalBody.addEventListener('scroll', function () {
            // スクロール可能な高さ + スクロール量 が コンテンツ全体の高さ になったら
            const tolerance = 5; // 5px程度の「遊び」
            if (modalBody.scrollHeight - modalBody.scrollTop - modalBody.clientHeight < tolerance) {
                // スクロールが一番下に達したら「同意する」ボタンを有効化
                agreeBtn.disabled = false;
            }
        });
    }

    // 閉じる (同意するボタン)
    if (agreeBtn && modal && confirmBtn) {
        agreeBtn.addEventListener('click', function () {
            modal.style.display = 'none';

            // 「確認へ」ボタンを有効化 (disabled属性を削除)
            confirmBtn.removeAttribute('disabled');
        });
    }

    // 閉じる (モーダルの外側をクリック)
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // --- 「確認へ」ボタン処理 (API送信ではなく、確認画面へのデータ渡し) ---
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function (e) {
            // (1) ボタンが disabled の場合は何もしない
            if (this.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }

            // (2) リンクのデフォルト動作（画面遷移）を一旦停止
            e.preventDefault();

            // (3) フォームの各値を取得
            const accountId = document.getElementById('account-id').value;
            const nickname = document.getElementById('nickname').value;
            const password = document.getElementById('password').value; // ★追加: パスワードも取得
            const passwordConfirm = document.getElementById('password-confirm').value; // ★追加: 確認用パスワードも取得
            const prefecture = document.getElementById('prefecture').textContent;
            const city = document.getElementById('city').textContent;
            const birthYear = document.getElementById('birth-year').value;
            const bio = document.getElementById('bio').value;

            // 性別の値を取得
            let gender = "";
            let genderValue = ""; // "male", "female", "other" を保存
            if (document.getElementById('male').checked) {
                gender = "男性";
                genderValue = "male";
            } else if (document.getElementById('female').checked) {
                gender = "女性";
                genderValue = "female";
            } else if (document.getElementById('other').checked) {
                gender = "その他";
                genderValue = "other";
            }

            // (4) 取得した値を一つのオブジェクトにまとめる
            const registrationData = {
                accountId: accountId,
                nickname: nickname,
                prefecture: prefecture,
                city: city,
                birthYear: birthYear,
                genderDisplay: gender, 
                genderValue: genderValue, 
                bio: bio,
                password: password, // ★パスワードをsessionStorageに含める
                passwordConfirm: passwordConfirm // ★確認用パスワードをsessionStorageに含める
            };

            // (5) sessionStorageにJSON文字列として保存
            sessionStorage.setItem('regData', JSON.stringify(registrationData));

            // (6) 保存が完了したら、本来のリンク先（確認画面）へ遷移
            window.location.href = this.href;
        });
    }
});