// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import './signup.css'; // optional if styling separately

// export default function SignupPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     // TODO: Connect to Amplify Auth
//     console.log('Signing up with:', email, password);
//     router.push('/name');
//   };

//   return (
//     <div className="signupContainer">
//       <h1>Sign Up</h1>
//       <form onSubmit={handleSubmit} className="form">
//         <label>
//           Email
//           <input
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//         <label>
//           Password
//           <input
//             type="password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </label>
//         <label>
//           Confirm Password
//           <input
//             type="password"
//             required
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//         </label>
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// }

'use client'

import SignupForm from '@/components/signup'

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <SignupForm />
    </main>
  )
}