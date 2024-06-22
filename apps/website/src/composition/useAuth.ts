
export function useAuth() {
    const router = useRouter()
    async function logout() {
        await BackendClient.delete("auth")
        localStorage.removeItem("has-login")
    }

    async function login(code: string, state: string) {
        if (state !== localStorage.getItem("state")) return false;
        await BackendClient.post("auth/login", { code })
        localStorage.setItem("has-login", "true")
        return true;
    }

    function startOAuth() {
        const url = "https://discord.com/api/oauth2/authorize";
        const clientId = "1013280626000003132";
        const redirectUri = new URL(router.resolve("/redirect").href, window.location.origin).href;
        const state = (Math.random() + 1).toString(36).substring(3);
        localStorage.setItem("state", state)
        localStorage.setItem("last-visit", router.currentRoute.value.fullPath)
        window.location.replace(`${url}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&state=${state}&prompt=none`);
    }

    return { logout, startOAuth, login };
}
