const SignUp = () => {
  return (
    <form>
      <h1>Sign Up</h1>
      <div>
        <label htmlFor="email">Email Address</label>
        <input type="text" name="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
      </div>
      <button>Sign Up</button>
    </form>
  );
}

export default SignUp;