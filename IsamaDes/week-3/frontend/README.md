<!-- using cookies because its a safe option and lets me get data from the backend without passing an id in the url string

| Step                         | What Happens                                                                                      | Transport   |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | ----------- |
| **1️⃣ Login**                 | Backend sets both tokens as cookies: `accessToken` (short-lived) and `refreshToken` (long-lived). | Cookies     |
| **2️⃣ Protected routes**      | Browser automatically sends cookies with every request (`withCredentials: true`).                 | Cookies     |
| **3️⃣ Middleware checks JWT** | Backend reads `accessToken` from cookies, verifies it, attaches user to `req.user`.               | Server side |
| **4️⃣ If expired**            | Frontend gets 401, silently calls `/auth/refresh-token` — backend issues new cookies.             | Cookies     |
| **5️⃣ Logout**                | Backend clears cookies (`res.clearCookie(...)`).                                                  | Cookies     |

` -->
