// "use client"

// import { useRouter } from 'next/navigation';

// export default function Home() {

//   const router = useRouter();
//   const handleSignup = () => router.push('/register');
//   const handleLogin = () => router.push('/login');

//   return (
//     <main>
//       <div className="flex justify-between items-center mb-4 h-[50px]  rounded-lg p-8">

//         <div className="flex justify-end gap-2 ">
//           <a
//             href="https://github.com/IsamaDes/todo-frontend"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
//           >
//             Frontend GitHub
//           </a>
//           <a
//             href="https://github.com/IsamaDes/todo-backend"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
//           >
//             Backend GitHub
//           </a>
//         </div>


//         <div className="flex justify-between items-center gap-2 rounded-lg">
//           <button className="bg-blue-500 text-white px-4 rounded" onClick={() => handleSignup()}>
//             Sign Up
//           </button>
//           <button className="bg-blue-500 text-white px-4 rounded" onClick={() => handleLogin()}>
//             Login
//           </button>
//         </div>

//         <img src="/welcomeimg.jpg" alt="Healthy food" classname="absolute inset-0 w-full h-full object-cover" />
//       </div>



//     </main>
//   );
// }














"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleSignup = () => router.push("/register");
  const handleLogin = () => router.push("/login");

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      <img
        src="/welcomeimg.jpg"
        alt="Healthy food"
        className="absolute inset-0 w-full h-full -z-10"
      />

      {/* 🔹 Overlay (optional, gives dark tint for readability) */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* 🔸 Content */}
      <div className="flex justify-between items-center mb-4 w-full max-w-5xl rounded-lg p-8 text-white">
        <div className="flex justify-end gap-2">
          <a
            href="https://github.com/IsamaDes/todo-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Frontend GitHub
          </a>
          <a
            href="https://github.com/IsamaDes/todo-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Backend GitHub
          </a>
        </div>

        <div className="flex justify-between items-center gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSignup}
          >
            Sign Up
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
