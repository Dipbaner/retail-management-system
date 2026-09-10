package com.novatech.retail_system_backend.service;

import com.novatech.retail_system_backend.exception.CustomerNotFoundException;
import com.novatech.retail_system_backend.model.Customer;
import com.novatech.retail_system_backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // GET ALL CUSTOMERS
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // GET CUSTOMER BY ID
    public Customer getCustomerById(Long id){
        return customerRepository.findById(id)
                .orElseThrow( () -> new CustomerNotFoundException(
                        "Customer not found with id : "+id
                ));
    }

    // CREATE CUSTOMER
    public Customer createCustomer(Customer customer) {
        if(customerRepository.existsByEmail(customer.getEmail())) {
            throw new IllegalArgumentException(
                    "Customer with email already exists : "
                            +customer.getEmail()
            );
        }
        return customerRepository.save(customer);
    }

    // UPDATE CUSTOMER
    public Customer updateCustomer(Long id, Customer customer) {
        Customer existingCustomer = getCustomerById(id);

        if(!existingCustomer.getEmail().equals(customer.getEmail())
            && customerRepository.existsByEmail(customer.getEmail())) {
            throw new IllegalArgumentException(
                    "Customer with email already exists : "
                    +customer.getEmail()
            );
        }
        existingCustomer.setName(customer.getName());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setAddress(customer.getAddress());
        existingCustomer.setPhone(customer.getPhone());

        return customerRepository.save(existingCustomer);
    }

    // DELETE CUSTOMER
    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
}
