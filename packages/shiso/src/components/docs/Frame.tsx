import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type VideoHTMLAttributes,
} from 'react';
import { Hand } from '@/components/icons';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { styles } from './styles';

export interface FrameProps {
  caption?: ReactNode;
  hint?: ReactNode;
  children?: ReactNode;
}

function renderFrameText(value: ReactNode) {
  return typeof value === 'string' ? renderInlineMarkdown(value) : value;
}

function enhanceAutoplayVideos(children: ReactNode) {
  return Children.map(children, child => {
    if (!isValidElement(child) || child.type !== 'video') {
      return child;
    }

    const video = child as ReactElement<VideoHTMLAttributes<HTMLVideoElement>, 'video'>;

    return video.props.autoPlay
      ? cloneElement(video, { playsInline: true, loop: true, muted: true })
      : video;
  });
}

export function Frame({ caption, hint, children }: FrameProps) {
  return (
    <div className={styles.frameWrapper}>
      {hint ? (
        <div className={styles.frameHint}>
          <span className={styles.frameHintIcon} aria-hidden={true}>
            <Hand />
          </span>
          <span>{renderFrameText(hint)}</span>
        </div>
      ) : null}
      <figure className={styles.frame}>
        <div className={styles.frameContent}>{enhanceAutoplayVideos(children)}</div>
        {caption ? (
          <figcaption className={styles.frameCaption}>{renderFrameText(caption)}</figcaption>
        ) : null}
      </figure>
    </div>
  );
}
