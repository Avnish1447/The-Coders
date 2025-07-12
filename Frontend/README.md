
# ReWear: Community Clothing Exchange

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An innovative and stylish web application that facilitates a community-driven clothing exchange. Users can list their pre-loved clothing items for trade or sale, discover unique pieces from others, and contribute to a more sustainable fashion ecosystem.
<img width="959" height="473" alt="image" src="https://github.com/user-attachments/assets/72b2bb56-cdb6-4679-820e-6f893bea4dca" />
<img width="947" height="473" alt="image" src="https://github.com/user-attachments/assets/4e31c5a7-18d4-43ff-8196-e1af6c6aceac" />

---

## ✨ Key Features

- **Explore Page**: Browse a dynamic grid of available clothing items.
- **User Dashboard**: A personalized space for users to view their listed items, track their status (Available, Pending, Exchanged), and view personal stats.
- **List an Item**: An intuitive multi-step form for users to upload images and details about their clothing.
- **Admin Panel**: A protected route for administrators to review, approve, or reject new item submissions.
- **Modern UI/UX**: Built with Shadcn/UI and Tailwind CSS for a sleek, responsive, and accessible interface.
- **Light & Dark Modes**: Seamless theme switching for user comfort.
- **AI Integration**: Leverages Genkit for backend flows, starting with the item submission process.

---

## 🚀 Built With

This project is built on a modern, robust, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **AI/Backend Flows**: [Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation

---

## 📦 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js (version 18 or higher) and npm installed on your machine.
- `npm`
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/rewear-app.git
   cd rewear-app
   ```
2. **Install NPM packages:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root of the project and add any necessary environment variables (e.g., API keys for Genkit).
   ```env
   # Example for Google AI
   GOOGLE_API_KEY=YOUR_API_KEY_HERE
   ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

The codebase is organized to be clean, modular, and easy to navigate.

```
/
├── src/
│   ├── app/                # Next.js App Router: pages and layouts
│   │   ├── (pages)/        # Route groups for different sections
│   │   └── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── ai/                 # Genkit flows and AI logic
│   │   ├── flows/
│   │   └── genkit.ts       # Genkit initialization
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Shadcn/UI components
│   │   └── bottom-nav.tsx
│   │   └── main-nav.tsx
│   ├── contexts/           # React Context providers (Auth, Search)
│   ├── hooks/              # Custom React hooks (e.g., use-toast)
│   ├── lib/                # Utility functions & shared logic (e.g. cn, mock-data)
├── public/                 # Static assets
├── .env                    # Environment variables (untracked)
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.
