const fs = require('fs');
const path = require('path');
const ghpages = require('gh-pages');
require('dotenv').config();

const htmlPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// .env から値を読み込んで置換
htmlContent = htmlContent.replace('__FIREBASE_API_KEY__', process.env.FIREBASE_API_KEY);
htmlContent = htmlContent.replace(/__FIREBASE_PROJECT_ID__/g, process.env.FIREBASE_PROJECT_ID);

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);

// 必要な画像ファイルをdistに一括コピー
const assets = ['silhouette.png', 'kuku_l.png', 'kuku_r.png', 'satsumaimo.png', 'chappie_l.png', 'chappie_r.png'];
assets.forEach(file => {
    const src = path.join(__dirname, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(distDir, file));
    }
});

console.log('GitHub Pagesへ安全にビルド＆デプロイ中...');
ghpages.publish(distDir, {
    branch: 'gh-pages',
    // ⬇️ ここをご自身のGitHub情報に書き換えてください
    repo: 'git@github.com:dipsy103/stairs.git' 
}, (err) => {
    if (err) {
        console.error('デプロイエラー:', err);
    } else {
        console.log('🎉 成功！キーを隠した状態でGitHub Pagesに公開されました！');
        fs.rmSync(distDir, { recursive: true, force: true });
    }
});
