import { getSession, signOut } from "next-auth/react";
import { useDisconnect } from "wagmi";

// gets a prop from getServerSideProps
function User({ user }) {
  const { disconnectAsync } = useDisconnect();

  return (
    <div>
      <h4>User session:</h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button
        onClick={() => {
          disconnectAsync().then(() => signOut({ redirect: "/signin" }));
        }}
      >
        Sign out
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session);

  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

export default User;
