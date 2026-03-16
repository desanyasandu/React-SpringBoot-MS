package com.ead2.library_api.repository;

import com.ead2.library_api.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByMemberId(Long memberId);  // all loans by a member
    List<Loan> findByBookId(Long bookId);       // all loans for a book
}