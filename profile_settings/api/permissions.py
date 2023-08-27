from rest_framework.permissions import BasePermission


SAFE_METHODS = ["POST", "HEAD", "OPTIONS"]

READ_SAFE_METHODS = ["GET", "HEAD", "OPTIONS"]


class IsOwnerProfileOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `profile.user.id` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in READ_SAFE_METHODS:
            return True

        # Instance must have an attribute named `profile.user.id`.
        return obj.profile.user.id == request.user.id


class IsOwnerProfile(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `profile.user.id` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `profile.user.id`.
        return obj.profile.user.id == request.user.id


class IsOwnerWorkOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `work.profile.user.id` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in READ_SAFE_METHODS:
            return True

        # Instance must have an attribute named `work.profile.user.id`.
        return obj.work.profile.user.id == request.user.id


class IsOwnerSkillOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `skill.profile.user.id` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in READ_SAFE_METHODS:
            return True

        # Instance must have an attribute named `skill.profile.user.id`.
        return obj.skill.profile.user.id == request.user.id


class IsOwnerPricingOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `pricing.profile.user.id` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in READ_SAFE_METHODS:
            return True

        # Instance must have an attribute named `pricing.profile.user.id`.
        return obj.pricing.profile.user.id == request.user.id
