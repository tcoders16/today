// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// type DeleteRepoParams = {
//   owner: string;
//   repo: string;
// };

// export async function deleteRepo({ owner, repo }: DeleteRepoParams) {
//   try {
//     const response = await axios.delete(
//       `https://api.github.com/repos/${owner}/${repo}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
//           Accept: "application/vnd.github+json",
//         },
//       }
//     );

//     console.log(`Repository deleted: ${owner}/${repo}`);
//   } catch (error: any) {
//     if (error.response) {
//       console.error("GitHub API Error:", error.response.data);
//     } else {
//       console.error("Request Error:", error.message);
//     }
//   }
// }