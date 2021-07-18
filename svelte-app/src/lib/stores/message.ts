import { Writable, writable } from 'svelte/store';

interface RichMessageButton {
	text: string;
	action: Function;
}

interface RichMessage {
	text: string | Array<string>;
	timeout?: number;
	onExpire?: Function;
	buttons?: Array<RichMessageButton>;
}

const message: Writable<RichMessage | null> = writable(null);

export default message;
