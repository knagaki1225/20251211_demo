document.addEventListener('DOMContentLoaded', function () {
    const dataString = sessionStorage.getItem('regData');
    const createButton = document.querySelector('.btn-create-account');
    const backLink = document.getElementById('back-link-with-data');

    // (1) データ取得と表示
    if (!dataString) {
        document.querySelector('.intro-text').textContent = '登録データがありません。前のページからやり直してください。';
        if (createButton) createButton.style.display = 'none'; // ボタンを隠す
        return;
    }

    const data = JSON.parse(dataString);

    // ヘルパー関数: IDを指定してテキストを安全に設定
    function setText(id, value, fallback = '未入力') {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value || fallback;
        }
    }

    // 各要素に値をセット
    setText('display-account-id', data.accountId);
    setText('display-nickname', data.nickname);
    setText('display-prefecture', data.prefecture, '---');
    setText('display-city', data.city, '---');

    const yearText = data.birthYear ? data.birthYear + ' 年' : '未入力';
    setText('display-year', yearText);

    setText('display-gender', data.genderDisplay);

    const bioEl = document.getElementById('display-bio');
    if (bioEl) {
        if (data.bio) {
            bioEl.innerHTML = data.bio.replace(/\n/g, '<br>');
        } else {
            bioEl.textContent = '未入力';
        }
    }

    // (2) 「もどる」ボタンの制御
    if (backLink) {
        backLink.addEventListener('click', function (e) {
            e.preventDefault();
            // データを保持したまま、前のページに戻る
            window.history.back();
        });
    }

    // (3) 「アカウントを作成する」ボタンにAPI送信処理を実装
    if (createButton) {
        createButton.addEventListener('click', function (e) {
            e.preventDefault();


            sessionStorage.removeItem('regData');



            window.location.href = 'security.html';
            // --- 🚀 修正ここまで ---
        })
    };
});