// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Profile = () => {
//   const [loginHistory, setLoginHistory] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/user/login-history", { withCredentials: true })
//       .then((response) => {
//         setLoginHistory(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching login history:", error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Login History</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Browser</th>
//             <th>OS</th>
//             <th>Device</th>
//             <th>IP Address</th>
//             <th>Login Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loginHistory.map((entry, index) => (
//             <tr key={index}>
//               <td>{entry.browser}</td>
//               <td>{entry.os}</td>
//               <td>{entry.device}</td>
//               <td>{entry.ipAddress}</td>
//               <td>{new Date(entry.loginTime).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Profile;

import axios from "axios";
import { useEffect, useState } from "react";

const AccountSettings = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/user/login-history", {
      withCredentials: true, // ✅ Important for authentication
    })
    .then((response) => {
      setHistory(response.data);
    })
    .catch((error) => {
      console.error("Error fetching login history:", error);
    });
  }, []);

  return (
    <div>
      <h1>Login History</h1>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>{entry.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default AccountSettings;
  