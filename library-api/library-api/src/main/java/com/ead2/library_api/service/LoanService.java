package com.ead2.library_api.service;

import com.ead2.library_api.model.*;
import com.ead2.library_api.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    public LoanService(LoanRepository loanRepository,
                       BookRepository bookRepository,
                       MemberRepository memberRepository) {
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
    }

    public Loan createLoan(Long bookId, Long memberId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!book.isAvailable()) {
            throw new RuntimeException("Book is not available for loan");
        }

      
        book.setAvailable(false);
        bookRepository.save(book);

        Loan loan = new Loan();
        loan.setBook(book);
        loan.setMember(member);
        loan.setLoanDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14)); // 2 weeks
        loan.setStatus("ACTIVE");

        return loanRepository.save(loan);
    }

    public Loan returnBook(Long loanId) {
        Loan loan = getLoanById(loanId);
        if ("RETURNED".equals(loan.getStatus())) {
            throw new RuntimeException("Book already returned");
        }
        loan.setReturnDate(LocalDate.now());
        loan.setStatus("RETURNED");

       
        Book book = loan.getBook();
        book.setAvailable(true);
        bookRepository.save(book);

        return loanRepository.save(loan);
    }

    public void deleteLoan(Long id) {
        getLoanById(id);
        loanRepository.deleteById(id);
    }
}