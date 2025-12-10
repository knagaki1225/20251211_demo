// document.addEventListener('DOMContentLoaded', function () {
//     const securityCodeTextEl = document.querySelector('.security-code-text');
//     const nextStepButton = document.getElementById('btn-next-step');
//     const copyBox = document.querySelector('.copy-box'); // コピーボタンの要素を取得
    
//     // ... (securityKeyの設定およびコピー機能の実装部分は変更なし) ...
//     if (securityKey && securityCodeTextEl) {
//         // キーを要素に設定
//         securityCodeTextEl.textContent = securityKey;

//         // (2) コピー機能を実装
//         if (copyBox) {
//             const copyTextEl = copyBox.querySelector('p');
//             const originalText = 'Copy';

//             copyBox.addEventListener('click', function () {
//                 navigator.clipboard.writeText(securityKey)
//                     .then(() => {
//                         if (copyTextEl) {
//                             copyTextEl.textContent = 'Copied!';
//                             setTimeout(() => {
//                                 copyTextEl.textContent = originalText;
//                             }, 2000);
//                         }
//                     })
//                     .catch(err => {
//                         console.error('コピーに失敗しました:', err);
//                         if (copyTextEl) {
//                             const failText = 'Failed!';
//                             copyTextEl.textContent = failText;
//                             setTimeout(() => {
//                                 copyTextEl.textContent = originalText;
//                             }, 2000);
//                         }
//                     });
//             });
//         }
//     } else {
//         return;
//     }

//     // (3) 「ログインへ」ボタンの処理
//     if (nextStepButton) {
//         nextStepButton.addEventListener('click', function (e) {
//             e.preventDefault(); // デフォルトの遷移を防止

//             // ★変更点: プロジェクトIDを取得する処理を削除

//             // 遷移先の相対パスをprojectId=1で固定
//             const relativePath = 'login.html?projectId=1';

//             // 遷移
//             window.location.href = relativePath;
            
//             // 遷移後に、データをセッションストレージから削除（セキュリティ対策）
//             // 削除処理は遷移が始まる前に実行されます。
//             sessionStorage.removeItem('tempSecurityKey');
//             sessionStorage.removeItem('tempLoginId');
//             sessionStorage.removeItem('projectId');
//             console.log("セキュリティキー、ログインID、projectIdをsessionStorageから削除しました。");
//         });
//     }
// });