'use client';

import { CheckIcon, LinkIcon, Share2, } from "lucide-react";
import { useState } from "react";

import { Button } from "@d21/design-system/components/ui/button";
import { toast } from "@d21/design-system/components/ui/toast";
import { Tooltip } from "@d21/design-system/components/ui/tooltip";

interface ShareButtonsProps {
    directorySlug: string;
    startupId: string;
}

const ShareButtons = ({ directorySlug, startupId }: ShareButtonsProps) => {
    const [copied, setCopied] = useState(false);

    const getStartupUrl = () => {
        return `https://www.d21.so/s/${directorySlug}/${startupId}`;
    };

    const shareOnLinkedIn = () => {
        const startupUrl = getStartupUrl();
        const shareText = "<< Your thoughts go here >>";
        const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(startupUrl)}&text=${encodeURIComponent(`${shareText}\n\n${startupUrl}`)}`;
        window.open(linkedInShareUrl, '_blank', 'width=600,height=600');
    };

    const copyToClipboard = async () => {
        const startupUrl = getStartupUrl();
        await navigator.clipboard.writeText(startupUrl);
        setCopied(true);
        toast("📣 Copied to clipboard. Ready to share!");
        setTimeout(() => setCopied(false), 5000);
    };

    return (
        <div className="flex flex-row gap-2">
            <Tooltip className='hidden sm:flex' content={copied ? "Url copied" : "Copy url"}>
                <Button
                    variant="secondary"
                    icon
                    onClick={copyToClipboard}
                >
                    {copied ? <CheckIcon /> : <LinkIcon />}
                </Button>
            </Tooltip>
            <Tooltip className='hidden sm:flex' content="Share on Linkedin">
                <Button variant="secondary" icon onClick={shareOnLinkedIn}>
                    <Share2 />
                </Button>
            </Tooltip>

        </div>
    );
};

export default ShareButtons;
