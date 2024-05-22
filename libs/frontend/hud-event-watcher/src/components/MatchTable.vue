<script setup lang="ts">
import DataTable, { type DataTableProps, type DataTableRowDoubleClickEvent } from "primevue/datatable";
import Dialog from "primevue/dialog";
import Column from "primevue/column";
import Button from "primevue/button";
import InputSwitch from "primevue/inputswitch";
import { useToast } from "primevue/usetoast";
import { useMatches } from "../useMatches";
import { computed, ref } from "vue";
import { Match } from "../types";
import OutcomeSelection from "./OutcomeSelection.vue";
import BattleRatingDropdown from "./BattleRatingDropdown.vue";

const enabled = ref(false);
const { matches, reset, upload, isUploading } = useMatches(enabled);
const match = ref<Match | null>(null);
const toast = useToast();
const battleRating = ref<string>();
const removeUploadSuccess = ref(true)

function onRowDoubleClick(event: DataTableRowDoubleClickEvent) {
    match.value = event.data;
}

const playerListVisible = computed({
    get: () => match.value !== null,
    set: newValue => (match.value = newValue ? match.value : null),
});

const config: DataTableProps = {
    size: "small",
    scrollable: true,
    scrollHeight: "flex",
};

const canUpload = computed(() => matches.value.length > 0 && matches.value.some(it => it.isUploadable));

async function onClickUpload() {
    if (!battleRating.value) return toast.add({ detail: "請選擇分房", severity: "error", life: 3000, closable: true });
    const length = await upload({ battleRating: battleRating.value, deleteUploaded: removeUploadSuccess.value });
    toast.add({ detail: `已成功上傳 ${length} 場戰鬥`, severity: "success", life: 2500, closable: true });
}
</script>

<template>
    <DataTable :value="matches" @row-dblclick="onRowDoubleClick" v-bind="config">
        <template #empty>
            <div class="flex justify-content-center">還沒有錄製到任一戰鬥...</div>
        </template>
        <template #header>
            <div class="flex gap-2 align-items-center">
                <Button label="重設" :disabled="isUploading" text size="small" severity="danger" @click="reset">
                    <template #icon>
                        <MdiDelete class="mr-2" />
                    </template>
                </Button>
                <Button @click="enabled = !enabled" text>
                    <template #icon>
                        <MdiPause v-if="enabled" />
                        <MdiRecord v-else style="color: red" />
                    </template>
                </Button>
                <div id="footer-container" class="mr-auto" :class="{ recording: enabled }">
                    <span>錄製中</span>
                    <div class="dot-flashing mx-4"></div>
                </div>
                
                <Button label="上傳" text size="small" :disabled="!canUpload" @click="onClickUpload">
                    <template #icon>
                        <MdiUpload class="mr-2" />
                    </template>
                </Button>
                <InputSwitch v-model="removeUploadSuccess"/>
                <span class="ml-1 mr-3">自動移除上傳成功的戰鬥</span>
                <BattleRatingDropdown v-model="battleRating" />
            </div>
        </template>
        <Column field="uploadStatus" class="center w-7rem" header="上傳狀態">
            <template #body="{ data, field }">
                <template v-if="data[field]">
                    <MdiCheckboxMarkedCircleOutline v-if="data[field].success" class="text-green-500" />
                    <span v-else class="p-error">{{ data[field].reason }}</span>
                </template>
            </template>
        </Column>
        <Column field="isCompleted" class="center w-7rem" header="不完整">
            <template #body="{ data, field }">
                <MdiExclamationThick class="text-yellow-500" v-if="!data[field]" />
            </template>
        </Column>
        <Column class="center" header="場次">
            <template #body="{ index }">{{ index + 1 }}</template>
        </Column>
        <Column field="startTime" header="開始時間" class="center" />
        <Column field="enemyName" header="敵隊名稱" class="center" />
        <Column field="isVictory" header="勝負" class="center">
            <template #body="{ data, field }">
                <OutcomeSelection v-model="data[field]" />
            </template>
        </Column>

        <Dialog v-model:visible="playerListVisible" header="玩家名單">
            <div id="player-list" v-if="match">
                <span>載具</span>
                <span>ID</span>
                <span>ID</span>
                <span>載具</span>
                <template v-for="item in match.playerList" :key="item">
                    <span>{{ item.our?.vehicle }}</span>
                    <span>{{ item.our?.id }}</span>
                    <span>{{ item.enemy?.id }}</span>
                    <span>{{ item.enemy?.vehicle }}</span>
                </template>
            </div>
        </Dialog>
    </DataTable>
</template>

<style scoped lang="scss">
#player-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-radius: 1rem;
    overflow: hidden;
    border: 2px solid #00000020;
    background-color: #000000;
    span {
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;

        &:nth-child(4n),
        &:nth-child(4n + 1) {
            justify-content: center;
        }

        &:nth-child(4n + 2) {
            margin-right: 1px;
            justify-content: end;
        }

        &:nth-child(4n + 3) {
            margin-left: 1px;
        }

        &:nth-child(4n + 1),
        &:nth-child(4n + 2) {
            background-color: rgb(48, 72, 12);
        }

        &:nth-child(4n),
        &:nth-child(4n + 3) {
            background-color: rgb(102, 2, 2);
        }

        &:nth-child(-n + 4) {
            padding: 1rem;
            font-weight: bold;
            margin-bottom: 2px;
        }
    }
}

#footer-container {
    opacity: 0;
    transition: all 0.4s ease-out;
    display: flex;
    align-items: center;
    &.recording {
        opacity: 1;
    }
}
</style>
