import { Link } from "react-router-dom";
export function Login() {
  return (
    <div>
      <div>
        <h1>Instagram</h1>
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <input type="submit" placeholder="login" />
        </form>
        <span>OR</span>
        <span>Login with facebook</span>
      </div>
      <div>
        <span>Don&apos;t have an account?</span> <Link to="/">Sign u</Link>
      </div>
    </div>
  );
}
