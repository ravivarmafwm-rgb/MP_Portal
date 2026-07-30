import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { fetchProjectPhoto } from "@/lib/api";
export function ProjectPhotoImage({
  projectId,
  photoId,
  title,
}: {
  projectId: string;
  photoId: string;
  title: string;
}) {
  const query = useQuery({
    queryKey: ["project-photo", projectId, photoId],
    queryFn: () => fetchProjectPhoto(projectId, photoId),
    staleTime: 300000,
  });
  if (query.isLoading)
    return (
      <div className="grid h-44 place-items-center bg-muted/30 text-xs text-muted-foreground">
        Loading photo...
      </div>
    );
  if (query.isError || !query.data)
    return (
      <div className="grid h-44 place-items-center bg-muted/30">
        <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
      </div>
    );
  return (
    <img src={query.data} alt={title} className="h-44 w-full object-cover" />
  );
}
