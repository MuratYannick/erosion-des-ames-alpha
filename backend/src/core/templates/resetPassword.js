/**
 * Template HTML pour l'email de reinitialisation de mot de passe
 * @param {Object} data - Donnees pour le template
 * @param {string} data.username - Nom d'utilisateur
 * @param {string} data.resetUrl - URL de reinitialisation
 * @returns {Object} Objet contenant le sujet et le corps HTML de l'email
 */
const resetPasswordTemplate = (data) => {
  const { username, resetUrl } = data;

  const subject = 'Erosion des Ames - Reinitialisation de votre mot de passe';

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reinitialisation de mot de passe</title>
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
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 10px;
      margin-top: 20px;
      font-size: 13px;
      color: #721c24;
    }
    .info {
      background-color: #d1ecf1;
      border: 1px solid #bee5eb;
      border-radius: 4px;
      padding: 10px;
      margin-top: 15px;
      font-size: 13px;
      color: #0c5460;
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
      <p>Vous avez demande la reinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le bouton ci-dessous pour definir un nouveau mot de passe :</p>

      <div class="button-container">
        <a href="${resetUrl}" class="button">Reinitialiser mon mot de passe</a>
      </div>

      <div class="link-fallback">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
        <a href="${resetUrl}">${resetUrl}</a>
      </div>

      <div class="info">
        <strong>Note :</strong> Ce lien expirera dans 1 heure pour des raisons de securite.
      </div>

      <div class="warning">
        <strong>Attention :</strong> Si vous n'avez pas demande cette reinitialisation, ignorez cet email. Votre mot de passe restera inchange. Si vous recevez plusieurs emails de ce type sans les avoir demandes, veuillez contacter notre support.
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

Vous avez demande la reinitialisation de votre mot de passe sur Erosion des Ames.

Pour definir un nouveau mot de passe, visitez le lien suivant :
${resetUrl}

Ce lien expirera dans 1 heure pour des raisons de securite.

Si vous n'avez pas demande cette reinitialisation, ignorez cet email. Votre mot de passe restera inchange.

---
Erosion des Ames
`;

  return { subject, html, text };
};

module.exports = resetPasswordTemplate;
