package com.ead2.library_api.service;

import com.ead2.library_api.model.Book;
import com.ead2.library_api.repository.BookRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service  
public class BookService {

    private final BookRepository bookRepository;

    
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    public Book createBook(Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new RuntimeException("Book with this ISBN already exists");
        }
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book updatedBook) {
        Book existing = getBookById(id);
        existing.setTitle(updatedBook.getTitle());
        existing.setAuthor(updatedBook.getAuthor());
        existing.setIsbn(updatedBook.getIsbn());
        existing.setGenre(updatedBook.getGenre());
        existing.setAvailable(updatedBook.isAvailable());
        return bookRepository.save(existing);
    }

    public void deleteBook(Long id) {
        getBookById(id); // throws if not found
        bookRepository.deleteById(id);
    }
}