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
        <header class="flex justify-content-center" ref="header">
            <TransitionSlide :offset="[0, '20%']" :duration="1000" @after-enter="isLogoEnter = true">
                <div v-if="titleShow" class="flex relative align-items-center title-height">
                    <img id="t1fr-logo" :src="SquadLogo" alt="T1FR logo" />
                    <TransitionExpand :duration="1500" axis="x" @after-enter="isScrollDownHintShow = true">
                        <div v-if="isLogoEnter" id="introduction">
                            <div role="en-name">The First Frontline Rangers</div>
                            <div role="name">前線遊騎兵團</div>
                            <div role="slogan">沒有正義的和平就是暴虐。</div>
                        </div>
                    </TransitionExpand>
                    <TransitionFade>
                        <MdiChevronDoubleDown v-if="isScrollDownHintShow" class="scroll-down-hint w-full text-center absolute text-200" />
                    </TransitionFade>
                </div>
            </TransitionSlide>
        </header>
        <article>
            <ArticleSection header="關於我們">
                <div class="flex flex-column">
                    <p>
                        歡迎來到 T1FR
                        前線遊騎兵團。我們聯隊的核心目標是成為來自台灣的聯隊戰聯隊。自創隊以來，我們的隊員們在不斷的努力下，持續獲得世界前百的殊榮，使我們得以成為台灣唯一一個有持續獲得世界排名的聯隊，並且目前正朝世界前五十穩步邁進中。因此，我們非常歡迎您加入我們，共同為了台灣聯隊的榮譽奮鬥，創造台灣僅有的聯隊戰環境。
                    </p>
                    <p>
                        除此之外，每當世界大戰開始時，我們也積極參與。在過去「WWM: Operation
                        Nordwind」中，我們在各位隊員的積極參與下，更拿下了該賽季第一名的優秀成績！因此，如果您未來也不想錯過世界大戰的話，我們也非常歡迎您的加入！
                    </p>
                    <div class="text-center text-2xl font-bold text-600">我們的成就</div>
                    <SquadMedalCarousel />
                </div>
            </ArticleSection>
            <ArticleSection>
                <template #header> 我們的 <MdiDiscord class="mx-2" /> 社群 </template>
                <div class="flex lg:flex-row flex-column w-full gap-4">
                    <div class="flex flex-column justify-content-between gap-3">
                        <div class="flex flex-column gap-3">
                            <div class="font-italic">想找人一起組隊玩遊戲嗎？想要找人聊天打屁嗎？玩遊戲太無聊想聽別人玩遊戲當背景音樂嗎？</div>
                            <div>
                                我們的社群有非常多活躍的隊員！無論您只是想文字聊天，或者想要和我們語音閒聊，我們都有許多隊員很樂意和您聊天、交朋友（只要您不違反我們的版規），歡迎各路好手來和我們蕉流蕉流！
                            </div>
                            <div class="text-600 vertical-align-bottom">
                                <strong>請注意：</strong>為了維護其他使用者的帳號安全，我們的 <MdiDiscord class="mx-1" style="margin-bottom: -4px" /> Discord
                                社群需要您的帳號進行手機驗證，造成不便敬請見諒
                            </div>
                        </div>
                        <ExternalLink href="https://discord.gg/t1fr" class="align-self-center bg-discord w-full">
                            <template #icon>
                                <MdiDiscord />
                            </template>
                            <span class="text-2xl line-height-1">加入我們的 Discord</span>
                        </ExternalLink>
                    </div>
                    <img :src="BlurDiscordPreview" alt="Our community" class="border-round-2xl shadow-4" style="object-fit: cover" />
                </div>
            </ArticleSection>
        </article>
        <footer>
            <div class="text-400 mr-auto">© Copyright by T1FR@R&D</div>
            <ExternalLink href="https://discord.gg/t1fr" class="bg-discord border-round-2xl">
                <MdiDiscord />
            </ExternalLink>
            <ExternalLink href="https://www.youtube.com/@t1fr.official" class="bg-youtube border-round-2xl">
                <MdiYoutube />
            </ExternalLink>
        </footer>
    </div>
</template>

<style scoped lang="scss">
@import "primeflex/primeflex.scss";

.scroll-down-hint {
    animation: 1.2s ease-in-out 0s infinite;
    animation-name: bouncing;
    bottom: 16px;
    font-size: min(3.5rem, 6vw);
    opacity: v-bind(scrollHintOpacity);
}

.bg-discord {
    background-color: #7289da;
}

.bg-youtube {
    background-color: red;
}

#introduction {
    @include styleclass("flex flex-column justify-content-center ml-3");
    > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: clip;
    }

    div[role="en-name"] {
        font-size: min(3rem, 5vw);
    }

    div[role="name"] {
        @include styleclass("font-bold");
        font-size: min(6rem, 10vw);
    }
    div[role="slogan"] {
        @include styleclass("font-italic text-600");
        font-size: min(1rem, 1.5vw);
    }
}

#t1fr-logo {
    width: min(16rem, 28vw);
    height: min(16rem, 28vw);
}

#home-root {
    background-color: rgba(49, 49, 49, 100%);
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
        @include styleclass("flex flex-column gap-3 align-items-center");
        background-color: rgba(49, 49, 49, 60%);
    }

    footer {
        @include styleclass("mt-4 flex align-items-center p-2 gap-2");
        width: 100%;
        height: 4rem;
        background-color: var(--squadron-primary-color);
    }
}
</style>
