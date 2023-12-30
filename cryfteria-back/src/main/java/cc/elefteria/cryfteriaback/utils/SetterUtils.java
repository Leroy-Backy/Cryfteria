package cc.elefteria.cryfteriaback.utils;

import java.util.Objects;
import java.util.function.Consumer;

public class SetterUtils {
  public static <V> void setIfNotNull(V value, Consumer<V> setter) {
    if (Objects.nonNull(value)) {
      setter.accept(value);
    }
  }
}
