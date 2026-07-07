export interface PostSummary {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export interface PostPagination {
  next_page: string | null;
  results: PostSummary[];
}

export interface PostContentBlock {
  heading: string;
  body: {
    type: string;
    text: string;
    spans: unknown[];
  }[];
}

export interface PostDocument {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
      alt?: string;
    };
    author: string;
    content: PostContentBlock[];
  };
}
