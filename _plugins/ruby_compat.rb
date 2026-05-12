unless String.method_defined?(:tainted?)
  class String
    def tainted?
      false
    end
  end
end

unless Object.method_defined?(:tainted?)
  class Object
    def tainted?
      false
    end
  end
end
