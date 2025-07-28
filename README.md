# ITMS Bot 🤖

**ITMS Bot** est un chatbot intelligent développé pour IT Manager Solutions, destiné à répondre aux questions des visiteurs, collecter leurs coordonnées et offrir des services en ligne.

---

## 🚀 Fonctionnalités

- 🔐 Collecte sécurisée de leads : Nom, Téléphone, Email
- 🤖 Intégration OpenAI GPT-3.5 Turbo
- 📩 Envoi de SMS via API Orange
- 💾 Enregistrement des conversations et leads dans SQLite
- 🖥 Interface web responsive avec dark mode (Bootstrap 5)
- 🛡 Sécurité via `.env` (aucune clé en clair)
- ⚙️ Déploiement facile sur Render

---

## 🧪 Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/itms-bot.git
cd itms-bot
```

### 2. Créer un environnement virtuel

```bash
python -m venv venv
venv\Scripts\activate  # Sur Windows
# ou
source venv/bin/activate  # Sur Mac/Linux
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Créer un fichier `.env`

Copier le contenu de `.env.example` et créer `.env` :

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
FLASK_SECRET_KEY=your_flask_secret
ORANGE_API_CLIENT_ID=your_orange_id
ORANGE_API_CLIENT_SECRET=your_orange_secret
SMS_SENDER=+2376xxxxxxx
```

### 5. Lancer l'application localement

```bash
python app.py
```

---

## ☁️ Déploiement sur Render

### Configuration recommandée :

- **Environment** : Python 3
- **Start command** : `gunicorn app:app`
- **Build command** : *(laisser vide)*
- **Variables d’environnement** : copier depuis `.env`

---

## 📁 Arborescence simplifiée

```
.
├── app.py
├── chatbot.py
├── database.py
├── templates/
├── static/
├── requirements.txt
├── .env.example
└── README.md
```

---

## 📞 Contact

Développé par [Jovany Etong – IT Manager Solutions](https://facebook.com/it-manager.solution)

📧 contact@itms.cm  
📞 +237 620 292 141
