import type { MemberInfo } from "@t1fr/backend/member-manage";
import { defineStore } from "pinia";
import { Member } from "../types";

export const useAuthStore = defineStore("auth", () => {
    const userData = ref<Member>();
    const httpService = useHttpService();
    const router = useRouter()
    async function logout() {
        return httpService.delete("auth", null, { withCredentials: true }).then(() => (userData.value = undefined));
    }

    function infoToMember({ id, name, isOfficer, avatarUrl }: MemberInfo) {
        userData.value = new Member(id, name, isOfficer, false, avatarUrl)
    }

    function verify() {
        httpService
            .post<MemberInfo>("auth/verify", null, { withCredentials: true })
            .then((value) => infoToMember(value))
            .catch(console.warn);
    }

    async function login(code: string, state: string) {
        if (state !== localStorage.getItem("state")) return false;
        infoToMember(await httpService.post<MemberInfo>("auth/login", { code }, { withCredentials: true }));
        return true;
    }

    function startOAuth() {
        const url = "https://discord.com/api/oauth2/authorize";
        const clientId = "1013280626000003132";
        const redirectUri = new URL(router.resolve("/redirect").href, window.location.origin).href;
        const state = (Math.random() + 1).toString(36).substring(3);
        localStorage.setItem("state", state)
        localStorage.setItem("last-visit", router.currentRoute.value.fullPath)
        window.location.replace(`${url}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&state=${state}`);
    }

    return { userData, logout, verify, startOAuth, login };
});
