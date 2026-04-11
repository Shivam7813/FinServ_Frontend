package com.finserv.serviceImpl;

import com.finserv.dto.DashboardDTO;
import com.finserv.dto.RecentLoanDTO;
import com.finserv.enums.DocumentStatus;
import com.finserv.enums.LoanStatus;
import com.finserv.repository.DocumentRepository;
import com.finserv.repository.LoanApplicationRepository;
import com.finserv.service.DashboardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private LoanApplicationRepository loanRepo;

    @Autowired
    private DocumentRepository documentRepo;

    @Override
    @Transactional(readOnly = true)
    public DashboardDTO getDashboard() {

        try {
            Long activeLoans = loanRepo.countByStatus(LoanStatus.PENDING);
            Long pendingDocs = documentRepo.countByStatus(DocumentStatus.PENDING);
            Long approvedToday = loanRepo.countApprovedToday();
            Double disbursed = loanRepo.getDisbursedThisMonth();

// Recent Loans (Top 5)
            List<RecentLoanDTO> recentLoans =
                    loanRepo.getRecentLoans(PageRequest.of(0, 5));

            return new DashboardDTO(
                    activeLoans,
                    pendingDocs,
                    approvedToday,
                    disbursed != null ? disbursed : 0.0,
                    recentLoans
            );
            // logic
        } catch (Exception e) {
            throw new RuntimeException("Failed to load dashboard");
        }

    }
}
