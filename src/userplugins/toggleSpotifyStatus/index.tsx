import { definePluginSettings } from "@api/Settings";
import { getCurrentChannel } from "@utils/discord";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Button } from "@webpack/common";

interface EmojiNode {
    type: "emoji";
    name: string;
    surrogate: string;
}

const MessageActions = findByPropsLazy("sendMessage", "editMessage");

function sendEmote(node: EmojiNode) {
    MessageActions.sendMessage(getCurrentChannel().id, {
        content: settings.store.withName ? `${node.surrogate} - ${node.name.replace(":", "\\:")}` : node.surrogate
    });
}

const settings = definePluginSettings({
    withName: {
        type: OptionType.BOOLEAN,
        description: "Include the emoji's name",
        default: false,
    }
});

export default definePlugin({
    name: "Your Plugin",
    description: "This plugin does something cool",
    authors: [{
        name: "You!",
        id: 0n
    }],

    patches: [{
        find: ".EMOJI_POPOUT_STANDARD_EMOJI_DESCRIPTION",
        replacement: {
            match: /.Messages.EMOJI_POPOUT_STANDARD_EMOJI_DESCRIPTION}\)]/,
            replace: "$&.concat([$self.EmojiButton(arguments[0].node)])"
        }
    }],

    settings,

    EmojiButton(node: EmojiNode) {
        return <Button onClick={() => sendEmote(node)}>
            Send emote
        </Button>;
    }
});
