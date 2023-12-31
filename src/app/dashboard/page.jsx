"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import styles from "./page.module.css";

const Dashboard = () => {
  const session = useSession();
  let router = useRouter();

  //NEW WAY TO FETCH DATA
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, mutate, error, isLoading } = useSWR(
    `/api/posts?username=${session?.data?.user.name}`,
    fetcher
  );

  if (session.status === "unauthenticated") {
    router?.push("/dashboard/register");
  }

  if (session.status === "loading") {
    return <p>Loading.......................</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const desc = e.target[1].value;
    const img = e.target[2].value;
    const content = e.target[3].value;

    try {
      await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          img,
          content,
          username: session.data.user.name,
        }),
      });
      mutate();
      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  if (session.status === "authenticated") {
    return (
      <div className={styles.container}>
        <form className={styles.new} onSubmit={handleSubmit}>
          <h1>Add New Post</h1>
          <input type="text" placeholder="Title" className={styles.input} />
          <input type="text" placeholder="Desc" className={styles.input} />
          <input type="text" placeholder="Image" className={styles.input} />
          <textarea
            placeholder="Content"
            className={styles.textArea}
            cols="30"
            rows="10"
          ></textarea>
          <button className={styles.button}>Send</button>
        </form>
        <div className={styles.posts}>
          <h1>Posts</h1>
          {isLoading
            ? "loading"
            : data?.map((post) => (
                <div className={styles.post} key={post._id}>
                  <div className={styles.imgContainer}>
                    <img src={post.img} alt="" style={{width:"100%", height:"100%"}}/>
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <div
                    style={{
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className={styles.delete}
                      onClick={() => handleDelete(post._id)}
                    >
                      X
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    );
  }
};

export default Dashboard;
