import type { MemberInfo as RemoteMemberInfo } from "@t1fr/backend/member-manage";
import { defineStore } from "pinia";
import { MemberInfo } from "../types";

export const useAuthStore = defineStore("auth", () => {
    const userData = ref<MemberInfo>();
    const httpService = useHttpService();
    const router = useRouter()
    async function logout() {
        return httpService.delete("auth", null, { withCredentials: true }).then(() => {
            localStorage.removeItem("has-login")
            userData.value = undefined
        });
    }

    function setInfoToMember({ id, name, isOfficer, avatarUrl }: RemoteMemberInfo) {
        userData.value = new MemberInfo({ id, name, isOfficer, avatarUrl })
    }

    async function verify() {
        return httpService
            .post<RemoteMemberInfo>("auth/verify", null, { withCredentials: true })
            .then((value) => {
                setInfoToMember(value)
                return true;
            })
            .catch(() => false)
    }

    async function login(code: string, state: string) {
        if (state !== localStorage.getItem("state")) return false;
        setInfoToMember(await httpService.post<MemberInfo>("auth/login", { code }, { withCredentials: true }));
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

    return { userData, logout, verify, startOAuth, login };
});
