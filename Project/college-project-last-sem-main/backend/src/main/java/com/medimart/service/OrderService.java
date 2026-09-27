package com.medimart.service;

import com.medimart.dto.CartItemRequest;
import com.medimart.dto.OrderDTO;
import com.medimart.dto.OrderItemDTO;
import com.medimart.dto.PlaceOrderRequest;
import com.medimart.entity.Customer;
import com.medimart.entity.Medicine;
import com.medimart.entity.Order;
import com.medimart.entity.OrderedMedicine;
import com.medimart.entity.Payment;
import com.medimart.repository.CustomerRepository;
import com.medimart.repository.MedicineRepository;
import com.medimart.repository.OrderRepository;
import com.medimart.repository.OrderedMedicineRepository;
import com.medimart.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

        private final OrderRepository orderRepository;
        private final CustomerRepository customerRepository;
        private final MedicineRepository medicineRepository;
        private final PaymentRepository paymentRepository;
        private final OrderedMedicineRepository orderedMedicineRepository;

        public OrderDTO placeOrder(String loginId, PlaceOrderRequest request) {
                Customer customer = customerRepository.findCustomerByLoginId(loginId)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));

                if (request.getItems() == null || request.getItems().isEmpty()) {
                        throw new RuntimeException("Items list cannot be empty");
                }

                int totalAmount = 0;
                for (CartItemRequest item : request.getItems()) {
                        Medicine medicine = medicineRepository.findById(item.getMId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Medicine not found: " + item.getMId()));
                        totalAmount += medicine.getMPrice() * item.getQuantity();
                }

                Order order = Order.builder()
                                .oDate(LocalDate.now())
                                .oAddress(request.getOAddress())
                                .oStatus("PENDING")
                                .oAmt(totalAmount)
                                .customer(customer)
                                .build();

                order = orderRepository.save(order);

                String paymentStatus = "CASH_ON_DELIVERY".equals(request.getPaymentMethod()) ? "PENDING" : "PAID";

                Payment payment = Payment.builder()
                                .pMethod(request.getPaymentMethod())
                                .pDate(LocalDate.now())
                                .pAmount(order.getOAmt())
                                .pStatus(paymentStatus)
                                .order(order)
                                .build();

                paymentRepository.save(payment);

                for (CartItemRequest item : request.getItems()) {
                        Medicine medicine = medicineRepository.findById(item.getMId()).get();
                        OrderedMedicine om = OrderedMedicine.builder()
                                        .order(order)
                                        .medicine(medicine)
                                        .quantity(item.getQuantity())
                                        .priceAtOrder(medicine.getMPrice())
                                        .build();
                        orderedMedicineRepository.save(om);
                }

                return toDTO(order);
        }

        public List<OrderDTO> getMyOrders(String loginId) {
                Customer customer = customerRepository.findCustomerByLoginId(loginId)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));
                return orderRepository.findOrdersByCustomerId(customer.getId())
                                .stream().map(this::toDTO).collect(Collectors.toList());
        }

        public List<OrderDTO> getAllOrders() {
                return orderRepository.findAllOrdersSorted().stream()
                                .map(this::toDTO).collect(Collectors.toList());
        }

        public OrderDTO getOrderById(Integer id) {
                return toDTO(orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found")));
        }

        public OrderDTO updateOrderStatus(Integer oId, String status) {
                Order order = orderRepository.findById(oId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));
                order.setOStatus(status);
                return toDTO(orderRepository.save(order));
        }

        public OrderDTO cancelOrder(Integer id) {
                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Order not found"));
                order.setOStatus("CANCELLED");
                return toDTO(orderRepository.save(order));
        }

        private OrderDTO toDTO(Order o) {
                List<OrderItemDTO> items = orderedMedicineRepository.findByOrderId(o.getId()).stream()
                                .map(om -> OrderItemDTO.builder()
                                                .mId(om.getMedicine().getId())
                                                .mName(om.getMedicine().getMName())
                                                .quantity(om.getQuantity())
                                                .price(om.getPriceAtOrder())
                                                .build())
                                .collect(Collectors.toList());

                return OrderDTO.builder()
                                .oId(o.getId())
                                .oDate(o.getODate())
                                .oAddress(o.getOAddress())
                                .oStatus(o.getOStatus())
                                .oAmt(o.getOAmt())
                                .cId(o.getCustomer() != null ? o.getCustomer().getId() : null)
                                .cFullname(o.getCustomer() != null ? o.getCustomer().getCFullname() : null)
                                .items(items)
                                .build();
        }
}
