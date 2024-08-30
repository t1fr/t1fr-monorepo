<script setup lang="ts">
import { TransitionExpand, TransitionFade, TransitionSlide } from "@morev/vue-transitions";
import BlurDiscordPreview from "../assets/images/our_community_blur.png";
import SquadLogo from "../assets/images/squadron_logo.png";

definePage({ meta: { icon: "mdi-home" } });

const isLogoEnter = ref(false);
const titleShow = ref(false);
const isScrollDownHintShow = ref(false);

onMounted(async () => {
    await nextTick();
    const image = document.createElement("img");
    image.src = SquadLogo;
    image.onload = () => (titleShow.value = true);
});

const root = ref();
const header = ref();
const { y } = useScroll(root);
const { height } = useElementSize(header);
const scrollHintOpacity = computed(() => `${Math.max((height.value / 2 - y.value) / (height.value / 2), 0) * 100}%`);
</script>

<template>
    <div id="home-root" ref="root">
        <header class="flex justify-center" ref="header">
            <TransitionSlide :offset="[0, '20%']" :duration="1000" @after-enter="isLogoEnter = true">
                <div v-if="titleShow" class="flex relative items-center title-height">
                    <img id="t1fr-logo" :src="SquadLogo" alt="T1FR logo" />
                    <TransitionExpand :duration="1500" axis="x" @after-enter="isScrollDownHintShow = true">
                        <div v-if="isLogoEnter" id="introduction">
                            <div role="en-name">The First Frontline Rangers</div>
                            <div role="name">前線遊騎兵團</div>
                            <div role="slogan">沒有正義的和平就是暴虐。</div>
                        </div>
                    </TransitionExpand>
                    <TransitionFade>
                        <MdiChevronDoubleDown
                            v-if="isScrollDownHintShow"
                            class="scroll-down-hint w-full text-center absolute text-surface-200 dark:text-surface-600"
                        />
                    </TransitionFade>
                </div>
            </TransitionSlide>
        </header>
        <article>
            <!-- <ArticleSection title="關於我們">
                <span>
                    歡迎來到 T1FR
                    前線遊騎兵團。我們聯隊的核心目標是成為來自台灣的聯隊戰聯隊。自創隊以來，我們的隊員們在不斷的努力下，持續獲得世界前百的殊榮，使我們得以成為台灣唯一一個有持續獲得世界排名的聯隊，並且目前正朝世界前五十穩步邁進中。因此，我們非常歡迎您加入我們，共同為了台灣聯隊的榮譽奮鬥，創造台灣僅有的聯隊戰環境。
                </span>
                <span>
                    除此之外，每當世界大戰開始時，我們也積極參與。在過去「WWM: Operation
                    Nordwind」中，我們在各位隊員的積極參與下，更拿下了該賽季第一名的優秀成績！因此，如果您未來也不想錯過世界大戰的話，我們也非常歡迎您的加入！
                </span>
                <template #item>
                    <SquadMedalCarousel />
                </template>
            </ArticleSection> -->
            <ArticleSection item-class="flex gap-4" title="我們的社群" reverse>
                <div class="italic">想找人一起組隊玩遊戲嗎？想要找人聊天打屁嗎？玩遊戲太無聊想聽別人玩遊戲當背景音樂嗎？</div>
                <div>
                    我們的社群有非常多活躍的隊員！無論您只是想文字聊天，或者想要和我們語音閒聊，我們都有許多隊員很樂意和您聊天、交朋友（只要您不違反我們的版規），歡迎各路好手來和我們蕉流蕉流！
                </div>
                <div class="text-surface-600 dark:text-surface-200 mt-auto">
                    <strong>請注意：</strong>為了維護其他使用者的帳號安全，我們的 Discord 社群需要您的帳號進行手機驗證，造成不便敬請見諒
                </div>
                <ExternalLink href="https://discord.gg/t1fr" class="self-center bg-discord w-full mt-4">
                    <template #icon>
                        <MdiDiscord />
                    </template>
                    <span class="text-2xl leading-none">加入我們的 Discord</span>
                </ExternalLink>
                <template #item>
                    <img :src="BlurDiscordPreview" alt="Our community" class="w-full" style="object-fit: cover" />
                </template>
            </ArticleSection>
        </article>
        <footer>
            <div class="text-surface-400 dark:text-surface-400 mr-auto">© Copyright by T1FR@R&D</div>
            <ExternalLink href="https://discord.gg/t1fr" class="bg-discord rounded-2xl">
                <MdiDiscord />
            </ExternalLink>
            <ExternalLink href="https://www.youtube.com/@t1fr.official" class="bg-youtube rounded-2xl">
                <MdiYoutube />
            </ExternalLink>
        </footer>
    </div>
</template>

<style scoped lang="scss">
.scroll-down-hint {
    animation: 1.2s ease-in-out 0s infinite;
    animation-name: bouncing;
    bottom: 16px;
    font-size: min(3.5rem, 6vw);
    opacity: v-bind(scrollHintOpacity);
}

#introduction {
    @apply flex flex-col justify-center ml-4;
    > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: clip;
    }

    div[role="en-name"] {
        font-size: min(3rem, 5vw);
    }

    div[role="name"] {
        @apply font-bold;
        font-size: min(6rem, 10vw);
    }
    div[role="slogan"] {
        @apply italic;
        font-size: min(1rem, 1.5vw);
    }
}

#t1fr-logo {
    width: min(16rem, 28vw);
    height: min(16rem, 28vw);
}

#home-root {
    z-index: 2;
    overflow-y: auto;

    &::before {
        background-image: url("../assets/images/squadron_banner_trans_bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 70%;
        opacity: 15%;
        z-index: -1;
        content: "";
        position: absolute;
        inset: 0;
    }

    header {
        height: calc(100dvh - 3rem - 16px);
    }

    article {
        @apply flex flex-col gap-4 items-center p-6;
        
        section {
            @apply w-full;
        }
    }

    footer {
        @apply mt-6 flex items-center p-2 gap-2 w-full h-[4rem];
    }
}
</style>
