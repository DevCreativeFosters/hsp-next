import {getAllPosts} from "@/lib/api";

export default async function Home() {
    const posts = await getAllPosts();
    return (
        <main>
            <h1>Posts</h1>
            <ul>
                {posts.edges.map((post) => (
                    <li>{post.node.title}</li>
                ))}
            </ul>
        </main>
    )
}
