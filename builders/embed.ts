import { RGB } from '@minecraft/server';
import { Author, Field, Footer, Image } from 'djs/types';

class EmbedBuilder {
  private title: string;
  private description: string;
  private url: string;
  private color: number;
  private image: Image;
  private footer: Footer;
  private author: Author;
  private fields: Array<Field> = [];

  public setTitle(title: string): this {
    this.title = title;
    return this;
  }

  // TODO
  public setType(): this {
    return this;
  }

  public setDescription(description: string): this {
    this.description = description;
    return this;
  }

  public setUrl(uri: string): this {
    this.url = uri;
    return this;
  }

  public setColor(color: RGB | number): this {
    if (typeof color === 'number') {
      this.color = color;
      return this;
    }
    this.color = (color.red << 16) | (color.green << 8) | color.blue;
    return this;
  }

  public setFooter(footer: string): this {
    this.footer = { text: footer };
    return this;
  }

  public setImage(uri: string): this {
    this.image = { url: uri };
    return this;
  }

  public setAuthor(author: string): this {
    this.author = { name: author };
    return this;
  }

  public addField(name: string, value: string, inline?: boolean): this {
    this.fields.push({ name, value, inline });
    return this;
  }

  public serialize(): string {
    return JSON.stringify({
      title: this.title,
      description: this.description,
      url: this.url,
      color: this.color,
      image: this.image,
      footer: this.footer,
      author: this.author,
      fields: this.fields,
      type: 'rich', // TODO: Implement type field properly in Discord API v11+
    });
  }
}

export { EmbedBuilder };
