package com.finserv.serviceImpl;

import com.finserv.dto.UserProfileDTO;
import com.finserv.entity.*;
import com.finserv.enums.EmploymentType;
import com.finserv.enums.State;
import com.finserv.repository.AddressRepository;
import com.finserv.repository.EmploymentDetailsRepository;
import com.finserv.repository.PersonalDetailsRepository;
import com.finserv.repository.UserRepository;
import com.finserv.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class UserProfileServiceImpl implements UserProfileService {


@Autowired
private UserRepository userRepo;

@Autowired
private PersonalDetailsRepository personalRepo;

@Autowired
private EmploymentDetailsRepository employmentRepo;

@Autowired
private AddressRepository addressRepo;

@Override
@Transactional
public void saveUserProfile(UserProfileDTO dto) {


User user = userRepo.findById(dto.getUserId())
        .orElseThrow(() -> new RuntimeException("User not found"));

/* ================= PERSONAL ================= */
PersonalDetails pd = personalRepo.findByUserId(user.getId());
if (pd == null) pd = new PersonalDetails();

pd.setUser(user);
pd.setFullName(dto.getFullName());
pd.setPanNumber(dto.getPanNumber());
pd.setAadhaarNumber(dto.getAadhaarNumber());
pd.setMobileNumber(dto.getMobileNumber());
pd.setEmail(dto.getEmail());

if (dto.getDateOfBirth() != null && !dto.getDateOfBirth().isEmpty()) {
    pd.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
}

personalRepo.save(pd);

/* ================= EMPLOYMENT ================= */
EmploymentDetails ed = employmentRepo.findByUserId(user.getId());
if (ed == null) ed = new EmploymentDetails();

ed.setUser(user);

if (dto.getEmploymentType() != null) {
ed.setEmploymentType(
EmploymentType.valueOf(dto.getEmploymentType().toUpperCase())
);
}

if ("SALARIED".equalsIgnoreCase(dto.getEmploymentType())) {
    ed.setCompanyName(dto.getCompanyName());
    ed.setWorkExperience(dto.getWorkExperience());
    ed.setMonthlySalary(dto.getMonthlySalary());

    ed.setBusinessName(null);
    ed.setAnnualIncome(null);
    ed.setBusinessType(null);

} else if ("SELF_EMPLOYED".equalsIgnoreCase(dto.getEmploymentType())) {
    ed.setBusinessName(dto.getBusinessName());
    ed.setAnnualIncome(dto.getAnnualIncome());
    ed.setBusinessType(dto.getBusinessType());

    ed.setCompanyName(null);
    ed.setWorkExperience(null);
    ed.setMonthlySalary(null);
}

employmentRepo.save(ed);

/* ================= ADDRESS ================= */
Address ad = addressRepo.findByUserId(user.getId());
if (ad == null) ad = new Address();

ad.setUser(user);
ad.setAddressLine1(dto.getAddressLine1());
ad.setAddressLine2(dto.getAddressLine2());
ad.setCity(dto.getCity());
ad.setPincode(dto.getPincode());

if (dto.getState() != null) {
ad.setState(State.valueOf(dto.getState().toUpperCase()));
}


addressRepo.save(ad);


}


}
