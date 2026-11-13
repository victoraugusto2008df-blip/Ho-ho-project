package com.hoho.shoppinghub;

import org.springframework.boot.SpringApplication;

public class TestShoppingHubApplication {

	public static void main(String[] args) {
		SpringApplication.from(ShoppingHubApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
