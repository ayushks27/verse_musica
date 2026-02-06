window.addEventListener("load", async () => {

  if (Clerk.user) {
  document.getElementById("auth-screen")?.classList.add("hidden");
}

  await Clerk.load();

  Clerk.mountUserButton(document.getElementById("clerk-user"));
  const box = document.getElementById("userBox");
  const name = document.getElementById("userName");
  const avatar = document.getElementById("userAvatar");

  // NOT LOGGED IN
  if (!Clerk.user) {

    name.textContent = "Sign In";
    avatar.src = "images/trend.png";

    box.onclick = () => Clerk.openSignIn();
    return;
  }

  // LOGGED IN
  name.textContent = Clerk.user.firstName || "User";
  avatar.src = Clerk.user.imageUrl;

  box.onclick = () => {
    Clerk.openUserProfile();
  };

});
