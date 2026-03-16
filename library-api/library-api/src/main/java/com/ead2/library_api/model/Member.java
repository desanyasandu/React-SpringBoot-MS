package com.ead2.library_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class   Member {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @NotBlank(message = "Name is Required")
   private String name;

   @Email(message = "Email is Required")
   @Column(unique = true)
   private String email;

   @NotBlank(message = "Phone num is required")
   private String phone;

   private boolean active = true;

   public Long getId() { return id; }
   public void setId(Long id) { this.id = id; }

   public String getName() { return name; }
   public void setName(String name) { this.name = name; }

   public String getEmail() { return email; }
   public void setEmail(String email) { this.email = email; }

   public String getPhone() { return phone; }
   public void setPhone(String phone) { this.phone = phone; }

   public boolean isActive() { return active; }
   public void setActive(boolean active) { this.active = active; }
}