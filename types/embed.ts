interface Footer {
  text: string;
  icon_uri?: string;
}

interface Author {
  name: string;
  icon_uri?: string;
  uri?: string;
}

interface Field {
  name: string;
  value: string;
  inline?: boolean;
}

interface Image {
  url: string;
}

export { Field, Author, Footer, Image };
