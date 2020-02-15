class Book {

  constructor({
    tags = [],
    status = "",
    _id = "",
    uploadDate = new Date(),
    title = "",
    author = "",
    synopsis = "",
    publisher = "",
    size = 0,
    imageFormat = "",
    language = "",
    format = "",
    sha1 = "",
    filename = "",
    publishDate = ""
  }) {
    this.tags = tags;
    this.status = status;
    this._id = _id;
    this.uploadDate = uploadDate;
    this.title = title;
    this.author = author;
    this.synopsis = synopsis;
    this.publisher = publisher;
    this.size = size;
    this.imageFormat = imageFormat;
    this.language = language;
    this.format = format;
    this.sha1 = sha1;
    this.publishDate = publishDate;
    this.filename = filename;
  }
}

export default Book;