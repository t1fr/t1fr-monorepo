import type { AccountType, AssignAccountOwnerOutput, ListAccountDTO, SetAccountTypeOutput } from "@t1fr/backend/member-manage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { Account } from "../types";

async function fetchAccount() {
    return BackendClient
        .get<ListAccountDTO[]>("accounts", { withCredentials: true })
        .then((data) => data.map(account => {
            const { id, name, personalRating, joinDate, activity, type, ownerId } = account;
            return new Account({ id, name, ownerId, personalRating, activity, type, joinDate })
        }))
}



async function updateAccountOwner({ id, ownerId }: { id: string, ownerId: string }) {
    return BackendClient.patch<AssignAccountOwnerOutput>(`accounts/${id}`, { ownerId })
}


async function updateAccountType({ id, type }: { id: string, type: AccountType }) {
    return BackendClient.patch<SetAccountTypeOutput>(`accounts/${id}`, { type })
}

export function useAccounts() {
    const queryClient = useQueryClient();
    const { data: accounts, refetch, isFetching } = useQuery({
        queryKey: ["accounts"],
        queryFn: () => fetchAccount(),
        placeholderData: []
    })

    const { mutate: mutateAccountType } = useMutation({
        mutationFn: updateAccountType,
        onSuccess(data) {
            queryClient.setQueryData<Account[]>(
                ["accounts"],
                oldAccounts => oldAccounts?.map(it => it.id === data.id ? it.setType(data.type) : it)
            )
        }
    })
    const { mutate: mutateAccountOwner } = useMutation({
        mutationFn: updateAccountOwner,
        onSuccess(data) {
            queryClient.setQueryData<Account[]>(
                ["accounts"],
                oldAccounts => oldAccounts?.map(it => it.id === data.account.id ? it.setOwner(data.newOwnerId) : it)
            )
        }
    })


    return { accounts, refetch, isFetching, mutateAccountType, mutateAccountOwner }
}