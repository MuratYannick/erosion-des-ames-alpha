/**
 * Template HTML pour l'email de verification
 * @param {Object} data - Donnees pour le template
 * @param {string} data.username - Nom d'utilisateur
 * @param {string} data.verificationUrl - URL de verification
 * @returns {Object} Objet contenant le sujet et le corps HTML de l'email
 */
const verifyEmailTemplate = (data) => {
  const { username, verificationUrl } = data;

  const subject = 'Erosion des Ames - Verifiez votre adresse email';

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification de votre email</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #4a1a8a;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #4a1a8a;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px 0;
    }
    .content p {
      margin: 10px 0;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      background-color: #4a1a8a;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 16px;
    }
    .button:hover {
      background-color: #3a1070;
    }
    .link-fallback {
      margin-top: 20px;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 4px;
      word-break: break-all;
      font-size: 12px;
      color: #666;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
    }
    .warning {
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      padding: 10px;
      margin-top: 20px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Erosion des Ames</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${username}</strong>,</p>
      <p>Merci de vous etre inscrit sur Erosion des Ames !</p>
      <p>Pour activer votre compte et acceder a toutes les fonctionnalites, veuillez verifier votre adresse email en cliquant sur le bouton ci-dessous :</p>

      <div class="button-container">
        <a href="${verificationUrl}" class="button">Verifier mon email</a>
      </div>

      <div class="link-fallback">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
        <a href="${verificationUrl}">${verificationUrl}</a>
      </div>

      <div class="warning">
        <strong>Important :</strong> Ce lien expirera dans 24 heures. Si vous n'avez pas demande cette verification, vous pouvez ignorer cet email.
      </div>
    </div>
    <div class="footer">
      <p>Cet email a ete envoye automatiquement par Erosion des Ames.</p>
      <p>Veuillez ne pas repondre a cet email.</p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
Bonjour ${username},

Merci de vous etre inscrit sur Erosion des Ames !

Pour activer votre compte, veuillez verifier votre adresse email en visitant le lien suivant :
${verificationUrl}

Ce lien expirera dans 24 heures.

Si vous n'avez pas demande cette verification, vous pouvez ignorer cet email.

---
Erosion des Ames
`;

  return { subject, html, text };
};

module.exports = verifyEmailTemplate;
