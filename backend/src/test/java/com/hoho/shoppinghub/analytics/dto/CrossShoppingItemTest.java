package com.hoho.shoppinghub.analytics.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.RecordComponent;
import org.junit.jupiter.api.Test;

class CrossShoppingItemTest {

    @Test
    void carriesOnlyCategoriaAndTotal() {
        assertThat(CrossShoppingItem.class.getRecordComponents())
                .extracting(RecordComponent::getName)
                .containsExactly("categoria", "total");
    }
}
