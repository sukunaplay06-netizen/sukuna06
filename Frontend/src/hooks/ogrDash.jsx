// .htaccess

// <IfModule mod_rewrite.c>
//   RewriteEngine On
//   RewriteBase /

//   # Allow existing files and folders
//   RewriteCond %{REQUEST_FILENAME} -f [OR]
//   RewriteCond %{REQUEST_FILENAME} -d
//   RewriteRule ^ - [L]

//   # React Router + IAS referral routes
//   RewriteRule ^ index.html [L]
// </IfModule>

// # Security headers
// <IfModule mod_headers.c>
//   Header set X-Content-Type-Options "nosniff"
//   Header set X-Frame-Options "SAMEORIGIN"
//   Header set X-XSS-Protection "1; mode=block"
// </IfModule>

// # Enable gzip compression
// <IfModule mod_deflate.c>
//   AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
// </IfModule>
