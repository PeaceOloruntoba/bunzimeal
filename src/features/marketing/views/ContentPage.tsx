interface ContentPageProps {
  contentType: string;
}

export default function ContentPage({ contentType }: ContentPageProps) {
  return <div className="p-8 text-primary">Content Page: {contentType}</div>;
}
