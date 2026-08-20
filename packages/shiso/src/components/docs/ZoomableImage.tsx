import { XIcon } from 'lucide-react';
import type { ImgHTMLAttributes } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface ZoomableImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  noZoom?: boolean;
}

export function ZoomableImage({
  noZoom = false,
  className,
  alt,
  src,
  ...props
}: ZoomableImageProps) {
  const image = (
    <img
      {...props}
      src={src}
      alt={alt}
      className={cn('block h-auto max-w-full rounded-lg', noZoom && 'my-6', className)}
    />
  );

  if (noZoom || !src) {
    return image;
  }

  const label = alt ? `View “${alt}” full size` : 'View image full size';

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            data-slot="zoomable-image"
            className="my-6 block w-fit max-w-full cursor-zoom-in rounded-lg text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={label}
          />
        }
      >
        {image}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/80 supports-backdrop-filter:backdrop-blur-sm"
        className="flex max-h-[calc(100vh-2rem)] w-auto max-w-[calc(100vw-2rem)] items-center justify-center bg-transparent p-0 ring-0 shadow-none sm:max-w-[calc(100vw-2rem)]"
      >
        <DialogTitle className="sr-only">{alt || 'Full-size image'}</DialogTitle>
        <img
          src={src}
          srcSet={props.srcSet}
          sizes={props.sizes}
          alt={alt || ''}
          className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] rounded-lg object-contain"
        />
        <DialogClose
          render={
            <button
              type="button"
              className="fixed top-4 right-4 inline-flex size-9 items-center justify-center rounded-full bg-black/60 text-white outline-none backdrop-blur-sm hover:bg-black/80 focus-visible:ring-3 focus-visible:ring-white/60"
              aria-label="Close full-size image"
            />
          }
        >
          <XIcon className="size-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
